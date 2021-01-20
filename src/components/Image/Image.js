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

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotateImg = () => {
    console.log("rotate");
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
    console.log("deleted");
    this.setState({ display: `none` });
  };

  scaleImg = () => {
    console.log("scale");
    this.setState({ scale1: 2, zindex: 1000 });
  };

  unscaleImg = () => {
    this.setState({ scale1: 1, zindex: 2 });
  };

  render() {
    const { rotation, display, scale1, zindex } = this.state;
    return (
      <div
        onMouseOut={this.unscaleImg}
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + "px",
          height: this.state.size + "px",
          transform: `rotate(${rotation}deg) scale(${scale1})`,
          display: `${display}`,
          zIndex: `${zindex}`,
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
            // style={{ opacity: `${opacity}` }}
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
    );
  }
}

export default Image;
