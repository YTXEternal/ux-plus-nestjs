import { IsString, IsNotEmpty } from 'class-validator';
export class AuthLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Account cannot be empty' })
  user_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
