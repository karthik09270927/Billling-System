import styled from 'styled-components';

const RainLoader = () => {
  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="cloud">
          <div className="cloud_left" />
          <div className="cloud_right" />
        </div>
        <div className="rain">
          <div className="drop" />
          <div className="drop" />
          <div className="drop" />
          <div className="drop" />
          <div className="drop" />
        </div>
        <div className="surface">
          <div className="hit" />
          <div className="hit" />
          <div className="hit" />
          <div className="hit" />
          <div className="hit" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .wrapper {
    height: 200px;
  }

  .cloud {
    overflow: hidden;
    padding: 5px;
    height: 50px;
  }

  .cloud_left {
    position: relative;
    float: left;
    background-color: #234;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.75);
  }

  .cloud_right {
    position: relative;
    float: left;
    background-color: #203040;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    top: 15px;
    left: -30px;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.75);
  }

  .rain {
    width: 180px;
    height: 140px;
  }

  .drop {
    position: relative;
    float: left;
    width: 2px;
    margin: 10px;
    left: 20px;
    background: #789;
    box-shadow: 1px 0.5px 1px 0.5px rgba(0, 0, 0, 0.75);
    animation: rain_401 0.8s infinite ease-out;
  }

  .drop:nth-child(1) {
    height: 15px;
    top: 5px;
    animation-delay: -1.0s;
  }

  .drop:nth-child(2) {
    height: 20px;
    animation-delay: -1.4s;
  }

  .drop:nth-child(3) {
    height: 15px;
    top: 5px;
    animation-delay: -1.6s;
  }

  .drop:nth-child(4) {
    height: 10px;
    top: 10px;
    animation-delay: -1.2s;
  }

  .drop:nth-child(5) {
    height: 5px;
    top: 15px;
    animation-delay: -1.6s;
  }

  @keyframes rain_401 {
    0% {
      opacity: 1;
      transform: translate(0, 0);
    }

    100% {
      opacity: 0.2;
      transform: translate(0, 100px);
    }
  }

  .surface {
    position: relative;
    width: 180px;
    height: 140px;
    top: -140px;
  }

  .hit {
    position: absolute;
    width: 3px;
    height: 1px;
    margin: 10px;
    bottom: -5px;
    border: 1px solid #456;
    border-radius: 50%;
    animation: hit_401 0.8s infinite ease;
  }

  .hit:nth-child(1) {
    left: 19px;
    animation-delay: -0.3s;
  }

  .hit:nth-child(2) {
    left: 41px;
    animation-delay: -0.7s;
  }

  .hit:nth-child(3) {
    left: 63px;
    animation-delay: -0.9s;
  }

  .hit:nth-child(4) {
    left: 85px;
    animation-delay: -0.5s;
  }

  .hit:nth-child(5) {
    left: 107px;
    animation-delay: -0.9s;
  }

  @keyframes hit_401 {
    0% {
      opacity: 0.75;
      transform: scale(1);
    }

    100% {
      opacity: 0;
      transform: scale(2.5);
    }
  }`;

export default RainLoader;
