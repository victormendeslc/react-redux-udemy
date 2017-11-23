import React, { Component } from 'react';
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm'
import TodoList from './todoList'

const URL = 'http://localhost:3003/api/todos';

export default class Todo extends Component {

    constructor(props) {
        super(props);
        this.state = { description: '', list: [] }
        this.refresh();

    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${description}/` : '';


        axios.get(`${URL}?sort=-createdAt${search}`)
            .then(resp => this.setState(
                {
                    ...this.state, description, list: resp.data
                }
            )
            );
    }

    handleSearch() {
        this.refresh(this.state.description);
    }

    handleChange(event) {
        this.setState({ ...this.state, description: event.target.value });
    }

    handleAdd() {
        const description = this.state.description;
        axios.post(URL, { description })
            .then(resp => this.refresh());
    }
    
    handleRemove(todo) {
        axios.delete(`${URL}/${todo._id}`)
            .then(resp => this.refresh(this.state.description));
    }

    handleMarkAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: true })
            .then(resp => this.refresh(this.state.description));
    }

    handleMarkAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, { ...todo, done: false })
            .then(resp => this.refresh(this.state.description));
    }

    handleClear(){
        this.refresh();
    }

    render() {
        return (
            <div>
                <PageHeader name='Tarefas' small='Cadastro'></PageHeader>
                <TodoForm
                    description={this.state.description}
                    handleChange={(e) => this.handleChange(e)}
                    handleAdd={() => this.handleAdd()}
                    handleSearch={(des) => this.handleSearch(des)}
                    handleClear={()=>this.handleClear()}
                />

                <TodoList list={this.state.list}
                    handleRemove={(e) => this.handleRemove(e)}
                    handleMarkAsDone={(todo) => this.handleMarkAsDone(todo)}
                    handleMarkAsPending={(todo) => this.handleMarkAsPending(todo)}
                />
            </div>
        )
    }
}