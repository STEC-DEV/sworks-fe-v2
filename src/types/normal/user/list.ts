interface UserListItem {
  userSeq: number;
  userName: string;
  role: string;
  job: string;
  phone: string;
  serviceTypes: UserServiceType[];
}

interface UserServiceType {
  userServiceTypeSeq: string;
  userServiceTypeName: string;
}

interface UserNameList {
  userName: string;
}
