export interface UserListItem {
  userSeq: number;
  userName: string;
  role: string;
  job: string;
  phone: string;
  sabun: string;
  images: string;
  serviceTypes: UserServiceType[];
}

interface UserServiceType {
  userServiceTypeSeq: string;
  userServiceTypeName: string;
}

interface UserNameList {
  userName: string;
}

export interface User {
  userSeq: number;
  userName: string;
  role: string;
  sabun: string;
  job: string;
  phone: string;
  email: string;
  serviceTypes: UserServiceType[];
  images: string;
}
