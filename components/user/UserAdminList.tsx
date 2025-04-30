import { UserType } from '@/entities/UserType';

import { RentalsUserType } from '@/entities/RentalsUserType';
import { Book, BookUser, Smartphone, UserCog } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

import { buttonVariants } from '../ui/button';

type UserAdminListPropsType = {
  users: Array<UserType>;
  rentals: Array<RentalsUserType>;
  searchString: string;
};

export default function UserAdminList({
  users,
  rentals,
  searchString,
}: UserAdminListPropsType) {
  const rentalAmount: { [key: number]: number } = {};

  rentals.map((r: any) => {
    if (r.userid in rentalAmount) {
      rentalAmount[r.userid] = rentalAmount[r.userid] + 1;
    } else rentalAmount[r.userid] = 1;
  });

  return (
    <Accordion type="multiple">
      {users
        .filter(
          (user) =>
            user.lastName.toLowerCase().includes(searchString) ||
            user.firstName.toLowerCase().includes(searchString) ||
            user.phone.toLowerCase().includes(searchString) ||
            user.id!.toString().includes(searchString)
        )
        .map((user) => (
          <AccordionItem key={user.id} value={user.id!.toString()}>
            <AccordionTrigger className="hover:no-underline text-base">
              <div className="flex space-x-2 items-center">
                <div className="relative p-2">
                  <BookUser className="size-7" />
                  {rentalAmount[user.id!] && (
                    <div className="absolute bg-chart-2 flex items-center justify-center rounded-full text-xs p-0.5 right-0 top-0 size-5 text-white">
                      {rentalAmount[user.id!]}
                    </div>
                  )}
                </div>

                <div>
                  <p>{`${user.firstName} ${user.lastName}`}</p>
                  <p className="flex items-center">
                    <Smartphone className="size-3 mr-1" />
                    {user.phone}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base space-y-1 px-3">
              <UserDetailsCard
                user={user}
                rentals={rentals.filter(
                  (r: any) => parseInt(r.userid) == user.id
                )}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}

interface UserDetailsCardPropType {
  user: UserType;
  rentals: Array<any>;
}

function UserDetailsCard({ user, rentals }: UserDetailsCardPropType) {
  return (
    <>
      <p>Взети книги:</p>
      {rentals.length == 0 ? (
        <p>Няма</p>
      ) : (
        <>
          {rentals?.map(({ id, title }) => {
            return (
              <p key={id} className="flex items-center space-x-2">
                <Book className="size-5" />
                {title}
              </p>
            );
          })}
        </>
      )}

      <Link
        href={'/user/' + user.id}
        className={buttonVariants({ variant: 'outline' })}
      >
        <UserCog />
        Още
      </Link>
    </>
  );
}
