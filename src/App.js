import React, { useState, useEffect } from "react";
import "./App.css";

let uuid = 1;
const App = () => {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		addStoredTodosToList();
		setLargestUUID();
	}, []);

	const addStoredTodosToList = () => {
		let archive = [];
		const keys = Object.keys(localStorage);
		for (let i = 0; i < keys.length; i++) {
			const item = JSON.parse(localStorage.getItem(keys[i]));
			archive.push({
				id: keys[i],
				todo: item.todo,
				done: item.done,
			});
		}

		archive
			.sort((a, b) => {
				return a.id - b.id;
			})
			.reverse();

		setTodos(archive);
	};

	const setLargestUUID = () => {
		const keys = Object.keys(localStorage);
		keys.map((key) => {
			if (uuid <= Number(key)) {
				uuid = Number(key) + 1;
			}
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const todoText = document.querySelector(".todoText").value;
		if (!todoText) return;

		const newTodo = {
			id: uuid,
			todo: todoText,
			done: false,
		};

		setTodos([newTodo, ...todos]);
		localStorage.setItem(uuid, JSON.stringify(newTodo));
		document.querySelector(".todoText").value = "";
		uuid++;
	};

	const handleEdit = (id) => {
		const editedTodo = todos.filter((item) => item.id === id);
		const updatedTodo = prompt("Edit todo", editedTodo[0].todo);

		editedTodo[0].todo = updatedTodo ? updatedTodo : editedTodo[0].todo;
		localStorage.setItem(id, JSON.stringify(editedTodo[0]));
		setTodos([...todos]);
	};

	const handleDelete = (id) => {
		const confirmation = confirm("Are you sure?");
		if (!confirmation) return;
		const deletedTodo = todos.findIndex((item) => item.id === id);
		todos.splice(deletedTodo, 1);
		localStorage.removeItem(id);
		setTodos([...todos]);
	};

	const handleComplete = (id) => {
		const completedTodo = todos.findIndex((item) => item.id === id);
		todos[completedTodo] = {
			...todos[completedTodo],
			done: !todos[completedTodo].done,
		};
		localStorage.setItem(id, JSON.stringify(todos[completedTodo]));
		setTodos([...todos]);
	};

	const completeAll = () => {
		todos.forEach((item) => {
			item.done = true;
			localStorage.setItem(item.id, JSON.stringify(item));
		});

		setTodos([...todos]);
	};

	const deleteAll = () => {
		const confirmation = confirm("Are you sure?");
		if (!confirmation) return;
		localStorage.clear();
		setTodos([]);
	};

	return (
		<div className='container'>
			<h1>Let's enter a todo!</h1>
			<form onSubmit={(e) => handleSubmit(e)}>
				<input
					className='todoText'
					type='text'
					placeholder='Enter something...'
					autoFocus
				/>
				<button type='submit'>Add</button>
			</form>
			<div className='extraActions'>
				<button className='completeAll' onClick={() => completeAll()}>
					Complete All
				</button>
				<button className='deleteAll' onClick={() => deleteAll()}>
					Delete All
				</button>
			</div>
			<ul>
				{todos.map((item) => (
					<li key={item.id}>
						<p className={item.done ? "strike" : ""}>{item.todo}</p>
						<span className='actionBtns'>
							<button onClick={() => handleEdit(item.id)}>
								<i className='material-icons'>edit</i>&nbsp;Edit
							</button>
							<button onClick={() => handleDelete(item.id)}>
								<i className='material-icons'>delete</i>
								&nbsp;Delete
							</button>
							<button onClick={() => handleComplete(item.id)}>
								<i className='material-icons'>done</i>&nbsp;
								Done
							</button>
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default App;
