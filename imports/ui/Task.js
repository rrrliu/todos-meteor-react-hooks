import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
export default function Task(props) {
  const toggleChecked = () => {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', props.task._id, !props.task.checked);
  };

  const deleteThisTask = () => {
    Meteor.call('tasks.remove', props.task._id);
  };

  const togglePrivate = () => {
    Meteor.call('tasks.setPrivate', props.task._id, !props.task.private);
  };

  // Give tasks a different className when they are checked off,
  // so that we can style them nicely in CSS
  const taskClassName = classnames({
    checked: props.task.checked,
    private: props.task.private,
  });

  return (
    <li className={taskClassName}>
      <button className="delete" onClick={deleteThisTask}>
        &times;
      </button>

      <input
        type="checkbox"
        readOnly
        checked={!!props.task.checked}
        onClick={toggleChecked}
      />

      {props.showPrivateButton ? (
        <button className="toggle-private" onClick={togglePrivate}>
          {props.task.private ? 'Private' : 'Public'}
        </button>
      ) : (
        ''
      )}

      <span className="text">
        <strong>{props.task.username}</strong>: {props.task.text}
      </span>
    </li>
  );
}

Task.propTypes = {
  task: PropTypes.any,
  showPrivateButton: PropTypes.bool,
};
