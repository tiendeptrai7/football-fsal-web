export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    slug: string;
    roles?: string[];
    is_change_password?: boolean;
  };
  accessToken: string;
  accessTokenExpiresAt: Date | string;
  refreshToken: string;
  refreshTokenExpiresAt: Date | string;
};

export type ChangePassword = {
  new_password: string;
  current_password: string;
};

export type ForgotRequest = {
  email: string;
};

export type VerifyRequest = {
  token: string;
};

export type ResetPasswordRequest = {
  password: string;
  token: string;
};

export type TokenPayload = {
  exp: number;
  permissions?: string[];
};
