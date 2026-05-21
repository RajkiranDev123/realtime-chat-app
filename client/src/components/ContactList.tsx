

type Contact = {
  _id: string;
  lastMessageTime: string;

  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;

  color?: number;
};

const ContactList = ({ contacts }: { contacts: Contact[] }) => {
  return <div>ContactList</div>;
};

export default ContactList;
