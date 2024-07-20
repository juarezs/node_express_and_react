import TUser from "@/models/user";
import { Card, CardContent } from "./ui/card";

export default function UserCard({user, ...props} : {user: TUser}) {
  return (
    <Card {...props} className="bg-slate-100 shadow">
      <CardContent className="grid justify-start p-4">
          <div className="block text-start mb-2">
            <div className="font-black">{user.name}</div>
          </div>
          <div className="block text-start my-2">
            <div className="font-medium">City</div>
            <div className="font-light">{user.city}</div>
          </div>
          <div className="block text-start my-2">
            <div className="font-medium">Country</div>
            <div className="font-light">{user.country}</div>
          </div>
          <div className="block text-start mt-2">
            <div className="font-medium">Favorite sport</div>
            <div className="font-light">{user.favorite_sport}</div>
          </div>
      </CardContent>
    </Card>
  );
}
