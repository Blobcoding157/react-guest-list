/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const makeItdissapear = css`
  font-size: 0px;
  border-radius: 5px;
`;

const inputContainer = css`
  border: thin;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: whitesmoke;
  box-shadow: 0 5px 12px 2px rgba(0, 0, 0, 0.15);
  border-radius: 11px;
`;

const customerInput = css`
  align-items: center;
  display: grid;
  margin: 8px;
  border-radius: 5px;
  padding: 5px 10px;
  box-shadow: 0 5px 12px 2px rgba(0, 0, 0, 0.15);
`;
const button = css`
  padding: 10px 25px;
  font-size: 20px;
  font-weight: 700;
  border: none;
  background-color: lightcoral;
  border-radius: 11px;
  cursor: pointer;
  box-shadow: 0 5px 12px 2px rgba(0, 0, 0, 0.15);
  transform: translate3d(0, -5px, 5px);

  transition: color 0.5s ease-in-out, transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;

  &:focus {
    outline: none;
  }

  &:hover {
    transform: translate3d(0, 0, 0);
    box-shadow: none;
  }
`;
const deleteButton = css`
  // padding: 5px 5px;
  font-size: 20px;
  margin: 10px;
  border: thin;
  background-color: lightcoral;
  border-radius: 11px;
  cursor: pointer;
  box-shadow: 0 5px 12px 2px rgba(0, 0, 0, 0.15);

  transition: color 0.5s ease-in-out, transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;

  &:focus {
    outline: none;
  }

  &:hover {
    border: solid;
    border-color: black;
  }
`;

const boxTick = css`
  border-radius: 5px;
  border: solid;
`;

const customerContainer = css`
  border: thin;
  background-color: whitesmoke;
  margin: 30px 80px;
  padding: 10px;
  box-shadow: 0 5px 12px 2px rgba(0, 0, 0, 0.15);
  border-radius: 11px;
`;
const customerList = css`
  list-style: none;
`;
// Base URL physical Server

// const baseUrl = 'http://localhost:4000';

// Base URL with Replit

const baseUrl =
  'https://express-guest-list-api-memory-data-store-1.blobcoding157.repl.co';

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
  // async function getGuest(id) {
  //   const response = await fetch(`${baseUrl}/guests/:${id}`);
  //   const guest = await response.json();
  //   setIsToUpdated(!isToUpdated);
  //   return guest;
  // }

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
    // const response =
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    // const deletedGuest = await response.json();
    setIsToUpdated(!isToUpdated);
  }
  function deleteAll() {
    restaurantCustomers.map(async (customer) => {
      await deleteGuest(customer.id);
    });
  }
  return (
    <>
      <div css={inputContainer}>
        <label css={makeItdissapear}>
          First name
          <input
            css={customerInput}
            disabled={isInputDisabled}
            value={first}
            placeholder="First Name"
            onChange={(event) => {
              setFirst(event.currentTarget.value);
            }}
          />
        </label>
        <label css={makeItdissapear}>
          Last name
          <input
            css={customerInput}
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
          css={button}
          onClick={() => {
            deleteAll();
          }}
        >
          delete all
        </button>
      </div>
      <div data-test-id="guest" css={customerContainer}>
        {isLoading ? <div>Loading...</div> : ''}
        <ul css={customerList}>
          {!isLoading &&
            restaurantCustomers.map((customer) => {
              return (
                <li key={`Customer-${customer.id}`}>
                  <button
                    css={deleteButton}
                    aria-label={`Remove ${customer.firstName} ${customer.lastName}`}
                    onClick={async () => {
                      await deleteGuest(customer.id);
                    }}
                  >
                    X
                  </button>
                  <span>
                    {customer.firstName} {customer.lastName}
                  </span>

                  {customer.attending ? ' is Attending!' : ''}
                  <input
                    css={boxTick}
                    aria-label="attending"
                    type="checkbox"
                    checked={customer.attending}
                    onChange={async (event) => {
                      setIsAttending(event.currentTarget.checked);

                      await updateGuest(customer.id);
                    }}
                  />
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
