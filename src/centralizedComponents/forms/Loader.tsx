    import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <section className="dots-container">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </section>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .dot {
    height: 20px;
    width: 20px;
    margin-right: 10px;
    border-radius: 10px;
    background-color: #5cb270;
    animation: pulse 1.5s infinite ease-in-out;
  }

  .dot:last-child {
    margin-right: 0;
  }

  .dot:nth-child(1) {
    animation-delay: -0.3s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.1s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.1s;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.8);
      background-color: #5cb270;
      box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
    }

    50% {
      transform: scale(1.2);
      background-color: #f4f269;
      box-shadow: 0 0 0 10px rgba(178, 212, 252, 0);
    }

    100% {
      transform: scale(0.8);
      background-color: #5cb270;
      box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
    }
  }`;

export default Loader;
