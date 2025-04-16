import { useState } from 'react';
import AddNewCardModal from '../components/stripeCardAddition';

const MyPage = () => {
  const [open, setOpen] = useState(false);
  const [cardIsEdited, setCardIsEdited] = useState(null);

  const fn_getCardInfo = () => {
    console.log('Fetching card info...');
    // implement your logic here
  };

  const fn_deleteCard = (cardId: any) => {
    console.log('Deleting card with ID:', cardId);
    // implement your logic here
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}>Add New Card</button>

      <AddNewCardModal
        open={open}
        setOpen={setOpen}
        cardIsEdited={cardIsEdited}
        setCardIsEdited={setCardIsEdited}
        fn_getCardInfo={fn_getCardInfo}
        fn_deleteCard={fn_deleteCard}
      />
    </div>
  );
};

export default MyPage;