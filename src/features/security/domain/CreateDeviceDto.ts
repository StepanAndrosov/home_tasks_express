

export class CreateDeviceDto {
    constructor(
        public ip: string,
        public title: string
    ) { }
}