interface UserList {
  data: Data;
  support: Support;
}

interface Data {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}
interface Support {
  url: string;
  text: string;
}

export { UserList, Data };
