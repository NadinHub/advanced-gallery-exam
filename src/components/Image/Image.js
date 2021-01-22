import React from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "./Image.scss";

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      rotation: `0`,
      display: "",
      scale1: 1,
      zindex: 1,
      opacityGray: 1,
    };
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = galleryWidth / imagesPerRow;
    this.setState({
      size,
    });
  }

  // For resizing we need to calculate an image size, for that there is a function calcImageSize
  handleResize = () => {
    this.calcImageSize();
  };

  componentDidMount() {
    this.calcImageSize();
    window.addEventListener("resize", this.handleResize);
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotateImg = () => {
    let newRotation = this.state.rotation + 90;
    if (newRotation >= 360) {
      newRotation = -360;
    }
    this.setState({
      rotation: newRotation,
    });
  };

  // function for "deleting" image ---
  deleteImg = () => {
    this.setState({ display: "none" });
  };

  scaleImg = () => {
    this.setState({ scale1: 2, zindex: 1000, opacityGray: 0 });
  };

  unscaleImg = () => {
    this.setState({ scale1: 1, zindex: 1, opacityGray: 1 });
  };

  render() {
    const { size, rotation, display, scale1, zindex, opacityGray } = this.state;
    return (
      <div
        className="image-root"
        style={{
          width: size + "px",
          height: size + "px",
          display: display,
          zIndex: zindex,
        }}
      >
        <img
          src={this.urlFromDto(this.props.dto)}
          onMouseOut={this.unscaleImg}
          style={{
            width: "100%",
            height: "100%",
            transform: `rotate(${rotation}deg) scale(${scale1})`,
            display: `${display}`,
            zIndex: `${zindex}`,
          }}
        />
        <div
          className="gray-cover"
          style={{
            opacity: opacityGray,
          }}
        >
          <div>
            <FontAwesome
              onClick={this.rotateImg}
              className="image-icon"
              name="sync-alt"
              title="rotate"
            />
            <FontAwesome
              onClick={this.deleteImg}
              className="image-icon"
              name="trash-alt"
              title="delete"
            />
            <FontAwesome
              onClick={this.scaleImg}
              className="image-icon"
              name="expand"
              title="expand"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Image;
