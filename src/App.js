/** @jsxImportSource @emotion/react */
import GuestElement from './GuestElement.js';
import { css } from '@emotion/react';

const container = css`
  border: double;
  min-block-size: 600px;
  border-color: tomato;
  background-color: gainsboro;
  align-items: flex-start;
  display: flex;
  padding: 20px;
  flex-direction: row;
`;
function App() {
  return (
    <>
      <main css={container}>
        <GuestElement />
      </main>
      <footer>©made by Patrik Industries wow!</footer>
    </>
  );
}

export default App;
