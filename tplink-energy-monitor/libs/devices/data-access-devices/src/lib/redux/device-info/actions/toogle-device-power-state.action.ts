import { ThunkAction } from 'redux-thunk';
// eslint-disable-next-line
import { ApplicationState } from '@tplink-energy-monitor/client/store-types';
import { Action } from 'redux';
import { deviceErrorAction } from './error.action';
import { DeviceAction, DeviceActionNames } from '../device-info-state.type';
import { ChangePowerStateDto } from '@tplink-energy-monitor/data-access-devices';
import { put } from '@tplink-energy-monitor/shared/utils-shared';

const setPowerState = async (id: string, newPowerState: boolean): Promise<DeviceAction<undefined>> => {
    const powerStateChangeDto = {
        id,
        powerState: newPowerState,
    };

    await put<ChangePowerStateDto>(`/api/device/${id}/power-state`, powerStateChangeDto);

    return {
        type: DeviceActionNames.DEVICE_GET_OK,
    } as DeviceAction<undefined>;
};

export const toggleDevicePowerState = (
    id: string,
    newPowerState: boolean,
): ThunkAction<void, ApplicationState, unknown, Action> => async (dispatch) => {
    if (!id) {
        return;
    }
    try {
        const devices = await setPowerState(id, newPowerState);
        dispatch(devices);
    } catch (error) {
        dispatch(deviceErrorAction(error));
    }
};
