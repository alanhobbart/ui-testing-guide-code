import React from 'react';
import { rest } from 'msw';
import { InboxScreen } from './InboxScreen';
import { Default as TaskListDefault } from './components/TaskList.stories';
import { within, fireEvent, findByRole } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
};

const Template = (args) => <InboxScreen {...args} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    rest.get('/tasks', (req, res, ctx) => {
      return res(ctx.json(TaskListDefault.args));
    }),
  ],
};

export const PinTask = Template.bind({});
PinTask.parameters = { ...Default.parameters };
PinTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole('listitem', { name });

  const itemToPin = await getTask('Export logo');
  const pinButton = await findByRole(itemToPin, 'button', { name: 'pin' });
  await fireEvent.click(pinButton);

  const unpinButton = within(itemToPin).getByRole('button', { name: 'unpin' });
  await expect(unpinButton).toBeInTheDocument();
};

export const SelectTask = Template.bind({});
SelectTask.parameters = { ...Default.parameters };
SelectTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole('listitem', { name });

  const itemToCheck = await getTask('Export logo');
  const checkBox = await findByRole(itemToCheck, 'checkbox');
  await fireEvent.click(checkBox);
  
  await expect(checkBox.checked).toBe(true);
};

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
Error.parameters = {
  msw: [
    rest.get('/tasks', (req, res, ctx) => {
      return res(ctx.json([]));
    }),
  ],
};