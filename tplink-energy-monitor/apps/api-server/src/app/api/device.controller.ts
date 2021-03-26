import { Controller, Get, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { StatusCodes } from 'http-status-codes';
import { Container, Service } from 'typedi';
import DevicesService from '../services/devices.service';

@Controller('api/device')
@Service()
export default class DeviceController {
    private readonly devicesService: DevicesService;

    constructor() {
        this.devicesService = Container.get(DevicesService);
    }

    @Get(':id')
    private async get(req: Request, res: Response) {
        try {
            Logger.Info(`Trying to get info for: ${req.params.id}`);
            return res.status(StatusCodes.OK).json(await this.devicesService.getDeviceById(req.params.id));
        } catch (err) {
            Logger.Err(err, true);
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: err.message,
            });
        }
    }

    @Put(':id/power-state')
    private async setPowerState(req: Request, res: Response) {
        try {
            Logger.Info(`Trying to set power state for ${req.params.id}`);
            await this.devicesService.setPowerState(req.params.id, req.body);
            return res.status(StatusCodes.OK);
        } catch (err) {
            Logger.Err(err, true);
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: err.message,
            });
        }
    }
}