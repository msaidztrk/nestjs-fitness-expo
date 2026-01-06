import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { InitUserDto } from './dto/init-user.dto';
import { InitUserResponseDto } from './dto/init-user-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Initialize user by device ID' })
    @ApiResponse({ status: 200, description: 'User initialized successfully', type: InitUserResponseDto })
    @Public()
    @Post('init')
    async init(@Body() initUserDto: InitUserDto): Promise<InitUserResponseDto> {
        return this.usersService.initByDeviceId(initUserDto);
    }

    @ApiOperation({ summary: 'Register a new user with email' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @Public()
    @Post('register')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
