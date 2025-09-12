export interface CreateUser {
  codeSeq: number | undefined;
  userName: string;
  sabun: string;
  job: string;
  email: string | undefined;
  phone: string;

  images: Array<File>;
}

export interface CreateUserClassification {
  serviceTypes: UserServiceType[];
  userTypes: UserType[];
}

export interface UserServiceType {
  userServiceTypeSeq: number;
  userServiceTypeName: string;
}

export interface UserType {
  codeSeq: number;
  codeName: string;
}
