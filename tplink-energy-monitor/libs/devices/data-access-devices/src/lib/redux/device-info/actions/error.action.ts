import { DeviceAction, DeviceActionNames } from '../device-info-state.type';
import { HttpFetchError } from '@tplink-energy-monitor/shared/utils-shared';

export const deviceErrorAction = (error: HttpFetchError): DeviceAction<{ message: string; status: number }> => ({
    type: DeviceActionNames.DEVICE_ERROR,
    payload: {
        status: error.status,
        message: error.message,
    },
});