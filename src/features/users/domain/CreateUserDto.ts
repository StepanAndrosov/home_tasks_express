export class CreateUserDto {
    constructor(
        public login: string,
        public password: string,
        public email: string
    ) { }
}
