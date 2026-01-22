import { Container, Spinner } from "react-bootstrap";

function Loader({ type }) {
  const wrapperClasses = [
    type === "chart" && "py-5 h-100 rounded opacity-75 bg-primary-subtle",
    type === "fullpage" && "min-vh-100 bg-primary-subtle",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Container
      fluid
      className={`d-flex justify-content-center align-items-center  ${wrapperClasses}`}
    >
      <Spinner
        className="p-4"
        animation="border"
        role="status"
        variant="primary"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
}

export default Loader;
