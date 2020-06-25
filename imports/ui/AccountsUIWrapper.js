import React, { useEffect } from 'react';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default function AccountsUIWrapper() {
  useEffect(() => {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template.loginButtons, this.container);
    return () => {
      // Clean up Blaze view
      Blaze.remove(this.view);
    };
  });
  // Just render a placeholder container that will be filled in
  return <span ref={(node) => (this.container = node)} />;
}
