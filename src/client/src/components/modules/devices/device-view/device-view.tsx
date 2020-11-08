import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ApplicationState } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getDeviceInfo } from '../../../../redux/device-info/actions/get-device-info.action';
import styles from './device-view.module.scss';
import { Card } from '../../../common/card/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { secondsToTimespan } from '../../../../utils/time-utils/time.utils';
import { LoadingSpinner } from '../../../common/loading-spinner/loading-spinner';
import { TPLinkPlug } from '../../../../models/devices/tp-link-plug.dto';

type DeviceViewRouteParams = {
    id: string;
};

export const DeviceView: React.FC = () => {
    const { id } = useParams<DeviceViewRouteParams>();
    const deviceState = useSelector((appState: ApplicationState) => appState.deviceInfo);
    const devicesState = useSelector((appState: ApplicationState) => appState.devices);
    const [currentDevice, setCurrentDevice] = React.useState<TPLinkPlug>();
    const dispatch = useDispatch();
    const history = useHistory();

    React.useEffect(() => {
        if (devicesState.status === 'PENDING') {
            history.push('/');
        } else if (devicesState.status === 'OK' && devicesState.devices) {
            setCurrentDevice(devicesState.devices.find((dev) => dev.id === id));
        }
    }, [devicesState, deviceState, id]);

    React.useEffect(() => {
        if (deviceState.status === 'PENDING' || (deviceState.status === 'OK' && deviceState.device?.id !== id)) {
            dispatch(getDeviceInfo(id));
        }
    }, [deviceState, id]);

    return (
        <div>
            {deviceState.status === 'PENDING' || (deviceState.status === 'LOADING' && <LoadingSpinner />)}
            {deviceState.status === 'OK' && (
                <div className="flex-col">
                    <h1 className="flex-center">{currentDevice?.alias}</h1>
                    <div className="flex-row">
                        <Card className={styles.powerCard}>
                            <div className="flex-col">
                                <h1 className={deviceState.device?.isActive ? styles.powerOn : styles.powerOff}>
                                    <FontAwesomeIcon icon={faPowerOff} />
                                </h1>
                                <small>{deviceState.device?.isActive ? 'on' : 'off'}</small>
                            </div>
                        </Card>
                        <Card className={styles.powerCard}>
                            <div className="flex-col">
                                <h1>
                                    {deviceState.device?.uptime ? secondsToTimespan(deviceState.device?.uptime) : '-'}
                                </h1>
                                <small className="flex-center">uptime</small>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};
