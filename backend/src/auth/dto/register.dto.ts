import { LoginUserDto } from '@/auth/dto/login.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto extends LoginUserDto {
  @IsString()
  @MinLength(1, {
    message: '이름을 입력해주세요',
  })
  @MaxLength(15, {
    message: '이름은 15글자를 넘어갈 수 없습니다',
  })
  @ApiProperty({
    type: String,
    description: '사용자 이름',
    maxLength: 15,
    minLength: 1,
  })
  name: string;
}
