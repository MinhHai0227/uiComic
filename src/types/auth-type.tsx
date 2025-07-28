export interface loginType {
  email: string;
  password: string;
}

export interface registerType {
  username: string;
  email: string;
  password: string;
}

export interface ChangePasswordResponse {
  message: string;
  id: number;
}
