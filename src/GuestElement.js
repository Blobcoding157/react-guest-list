/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

// Base URL
const baseUrl = 'http://localhost:4000';

export default function GuestElement() {
  const [restaurantCustomers, setRestaurantCustomers] = useState([]);
  const [isToUpdated, setIsToUpdated] = useState(true);

  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');

  const [isInputDisabled, setIsInputDisabled] = useState(true);

  const [isAttending, setIsAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Getting all guests (aka GET /guests)
  useEffect(() => {
    async function getAllGuests() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setRestaurantCustomers(allGuests);
      setIsLoading(false);
      setIsInputDisabled(false);
    }
    getAllGuests().catch((error) => console.log(error));
  }, [isToUpdated]);

  // Getting a single guest (aka GET /guests/:id)
  async function getGuest(id) {
    const response = await fetch(`${baseUrl}/guests/:${id}`);
    const guest = await response.json();
    setIsToUpdated(!isToUpdated);
    return guest;
  }

  // Creating a new guest (aka POST /guests)
  async function setGuest(firstInp, lastInp) {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstInp.toString(),
        lastName: lastInp.toString(),
      }),
    });
    const createdGuest = await response.json();
    setIsToUpdated(!isToUpdated);
    return createdGuest;
  }

  // Updating a guest (aka PUT /guests/:id)
  async function updateGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: isAttending }),
    });
    const updatedGuest = await response.json();
    setIsToUpdated(!isToUpdated);
    return updatedGuest;
  }

  // Deleting a guest (aka DELETE /guests/:id)
  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    setIsToUpdated(!isToUpdated);
  }
  function deleteAll() {
    restaurantCustomers.map(async (customer) => {
      await deleteGuest(customer.id);
    });
  }
  return (
    <>
      <div>
        <label>
          First name
          <input
            disabled={isInputDisabled}
            value={first}
            placeholder="First Name"
            onChange={(event) => {
              setFirst(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Last name
          <input
            disabled={isInputDisabled}
            value={last}
            placeholder="Last Name"
            onChange={(event) => setLast(event.currentTarget.value)}
            onKeyDown={async (event) => {
              if (event.key === 'Enter') {
                if (first && last) {
                  await setGuest(first, last);
                  setIsToUpdated(!isToUpdated);
                  setFirst('');
                  setLast('');
                }
              }
            }}
          />
        </label>
        <button
          onClick={() => {
            deleteAll();
          }}
        >
          delete all
        </button>
      </div>
      <div data-test-id="guest">
        {isLoading ? <div>Loading...</div> : ''}
        <ul>
          {!isLoading &&
            restaurantCustomers.map((customer) => {
              return (
                <li key={`Customer-${customer.id}`}>
                  <span>
                    {customer.firstName} {customer.lastName}
                  </span>

                  {customer.attending ? ' is Attending!' : ''}
                  <input
                    aria-label="attending"
                    type="checkbox"
                    checked={customer.attending}
                    onChange={async (event) => {
                      setIsAttending(event.currentTarget.checked);

                      await updateGuest(customer.id);
                    }}
                  />
                  <button
                    aria-label={`Remove ${customer.firstName} ${customer.lastName}`}
                    onClick={async () => {
                      await deleteGuest(customer.id);
                    }}
                  >
                    x
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
