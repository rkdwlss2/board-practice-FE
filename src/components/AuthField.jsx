function AuthField({ label, id, ...inputProps }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} {...inputProps} />
    </div>
  );
}

export default AuthField;
