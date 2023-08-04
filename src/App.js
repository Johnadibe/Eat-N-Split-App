import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  // Add Friend Button state to render the Add friend form
  const [showAddForm, setShowAddForm] = useState(false);

  //
  const [addFriend, setAddFriend] = useState(initialFriends);

  // State sfor selected friend
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setAddFriend((friends) => [...friends, friend]);
    setShowAddForm(false);
  }

  function handleShowAddFriend() {
    setShowAddForm((show) => !show);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    // Handle the select and close button
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddForm(false);
  }

  // Handler function to update the friends balance when the bill is splitted
  function handleSplitBill(value) {
    setAddFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          addFriend={addFriend}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddForm && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {!showAddForm ? "Add Friend" : "Close"}
        </Button>
      </div>

      {/* Split Form */}
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ addFriend, onSelection, selectedFriend }) {
  // const friends = initialFriends;
  return (
    <ul>
      {addFriend.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {Math.sign(friend.balance) === -1 && (
        <p className="red">
          You owe {friend.name} {`${Math.abs(friend.balance)}€`}
        </p>
      )}
      {Math.sign(friend.balance) === 1 && (
        <p className="green">
          {`${friend.name}'s`} owe you {`${friend.balance}€`}
        </p>
      )}
      {Math.sign(friend.balance) === 0 && (
        <p className="grey">You and {friend.name} are even</p>
      )}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(e) {
    // prevent default submission
    e.preventDefault();

    // If there are no input in the input field return OR guard clause
    if (!name || !image) return;

    // Create a variable for the new friends
    const newFriend = {
      name: name,
      image: image,
      balance: 0,
      id: crypto.randomUUID(),
    };

    // Then use the onAddFriend function that was created in the parent component which is App
    onAddFriend(newFriend);

    // Set name and Image back to default or clear the inputs when you add a friend
    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏼‍🤝‍👩🏻 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>♻ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  // Derived State
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    // Add guard clause
    if (!bill || !paidByUser) return;

    //
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByFriend);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💲 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧑 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👭 {selectedFriend.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled />

      <label>😜 Who is paying for the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
