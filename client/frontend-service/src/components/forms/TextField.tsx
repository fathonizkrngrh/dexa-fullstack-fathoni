import { Form } from "rsuite";

interface TextFieldProps {
  name: string;
  label: React.ReactNode;
  accepter?: React.ElementType;
  [key: string]: any;
}

function TextField(props: TextFieldProps) {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-3`}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
}

export default TextField;