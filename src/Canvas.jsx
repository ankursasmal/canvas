import React, { useState,useEffect, useContext } from 'react';
import './App.css'; 
  
const Canvas = () => {
  const [cards, setCards] = useState([]);
  const [draggingCard, setDraggingCard] = useState(null);
  const [resizingCard, setResizingCard] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  

  const addCard = () => {
    const newCard = {
      id: cards.length,
      title: `card ${cards.length + 1}`,
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur ex, fugiat sapiente, repellendus quam unde dolorum, suscipit illum dicta atque delectus? Minus fugit recusandae expedita officiis vero quae distinctio in",
      x: 100,
      y: 100,
      width: 200,
      height: 150
    };
    setCards([...cards, newCard]);
  };

  const handleMouseDown = (e, cardId) => {
    setDraggingCard(cardId);
  };

  const handleMouseMove = (e) => {
    if (draggingCard !== null) {
      setCards(cards.map(card => {
        if (card.id === draggingCard) {
          return { ...card, x: e.clientX - card.width / 2, y: e.clientY - card.height / 2 };
        }
        return card;
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingCard(null);
  };

  const handleResizeMouseDown = (e, cardId) => {
     e.preventDefault();  
    setResizingCard(cardId);
  };

  const handleResizeMouseMove = (e) => {
    if (resizingCard !== null) {
      setCards(cards.map(card => {
        if (card.id === resizingCard) {
          const newWidth = Math.max(100, e.clientX - card.x);  
          const newHeight = Math.max(100, e.clientY - card.y); 
          return { ...card, width: newWidth, height: newHeight };
        }
        return card;
      }));
    }
  };

  const handleResizeMouseUp = () => {
    setResizingCard(null);
  };

  const handleShowMore = (card) => {
    setSelectedCard(card);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCard(null);
  };

useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleResizeMouseMove);
    window.addEventListener('mouseup', handleResizeMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [draggingCard, resizingCard]);

  return (
    <div className="canvas-container"  >
      <div className="canvas">
        {cards.map((card,id) => (
          <div
            key={id}
            className="card  cursor-pointer"
            style={{
              marginLeft:`${id*4}px`,
              width: `${card.width}px`,
              height: `${card.height}px`,
 
              transform: `translate(${card.x}px, ${card.y}px)`
            }}
            onMouseDown={(e) => handleMouseDown(e, card.id)}
          >
            <h3>{card.title}</h3>
            <p>{card.content.slice(0, 50)}...</p>
            <button onClick={() => handleShowMore(card)}  className='text-blue-500'>Show More</button>
            <div
              className="resize-handle"
              onMouseDown={(e) => handleResizeMouseDown(e, card.id)}
            ></div>
          </div>
        ))}
         {showPopup && selectedCard && (
          <div className="popup mr-10">
            <h3>{selectedCard.title}</h3>
            <p>{selectedCard.content}</p>
            <button onClick={closePopup} className='px-3 py-.5 mt-1 bg-blue-600 text-white rounded-lg'>Close</button>
          </div>
        )}
      </div>
      <button className="add-card-button" onClick={addCard}>Add Card</button>
    </div>
  );
};

export default Canvas;
