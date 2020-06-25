import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks';

import Task from './Task';
import AccountsUIWrapper from './AccountsUIWrapper';

// App component - represents the whole app
export default function App() {
  const [text, setText] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const { tasks, incompleteCount, currentUser } = useTracker(() => {
    Meteor.subscribe('tasks');

    return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),
    };
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    Meteor.call('tasks.insert', text.trim());
    setText('');
  };

  const toggleHideCompleted = () => {
    setHideCompleted(!hideCompleted);
  };

  const renderTasks = () => {
    let filteredTasks = tasks;
    if (hideCompleted) {
      filteredTasks = filteredTasks.filter((task) => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = currentUser && currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Todo List ({incompleteCount})</h1>

        <label className="hide-completed">
          <input
            type="checkbox"
            readOnly
            checked={hideCompleted}
            onClick={toggleHideCompleted}
          />
          Hide Completed Tasks
        </label>

        <AccountsUIWrapper />

        {currentUser ? (
          <form className="new-task" onSubmit={handleSubmit}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type to add new tasks"
            />
          </form>
        ) : (
          ''
        )}
      </header>

      <ul>{renderTasks()}</ul>
    </div>
  );
}

App.propTypes = {
  incompleteCount: PropTypes.number,
};
