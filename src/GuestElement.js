/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const customers = [{ first: 'Mister', last: 'Testing', isAttending: false }];

export default function GuestElement() {
  const [restaurantCustomers, setRestaurantCustomers] = useState(customers);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAttending, setIsAttending] = useState(false);

  function deleteHandler(key) {
    const newList = restaurantCustomers.filter(
      (item) => `${item.first}${item.last}` !== key,
    );

    setRestaurantCustomers(newList);
  }
  return (
    <>
      <label>
        First name
        <input
          value={firstName}
          placeholder="First Name"
          onChange={(event) => setFirstName(event.currentTarget.value)}
        />
      </label>
      <label>
        Last name
        <input
          value={lastName}
          placeholder="Last Name"
          onChange={(event) => setLastName(event.currentTarget.value)}
        />
      </label>
      <button
        onClick={() => {
          if (firstName && lastName) {
            const newCustomer = {
              first: firstName,
              last: lastName,
              isBooked: false,
            };
            const newState = [...restaurantCustomers, newCustomer];
            setRestaurantCustomers(newState);
            setFirstName('');
            setLastName('');
          }
        }}
      >
        Return
      </button>
      <div data-test-id="guest">
        <ul>
          {restaurantCustomers.map((customer) => {
            return (
              <li key={`Customer-${customer.first}-${customer.last}`}>
                <span>
                  {customer.first} {customer.last}
                </span>

                {customer.isAttending ? ' is Attending!' : ''}
                <input
                  aria-label="attending"
                  type="checkbox"
                  checked={customer.isAttending}
                  onChange={(event) => {
                    setIsAttending(event.currentTarget.checked);
                    customer.isAttending = event.currentTarget.checked;
                  }}
                />
                <br />
                <button
                  onClick={() => {
                    deleteHandler(`${customer.first}${customer.last}`);
                  }}
                >
                  Remove {customer.first}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
