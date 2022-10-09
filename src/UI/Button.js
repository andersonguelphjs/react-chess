const Button = (props) => {

  return (
    <button type="button" onClick={props.click}>
      {props.text}
    </button>
  );
};

export default Button;
