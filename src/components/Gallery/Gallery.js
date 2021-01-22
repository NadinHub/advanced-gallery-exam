import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import "./Gallery.scss";
import InfiniteScroll from "react-infinite-scroll-component";

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      pageNumber: 1,
      // height: window.innerHeight,
      // width: window.innerWidth,
    };
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&&page=${this.state.pageNumber}per_page=100&format=json&nojsoncallback=1`;
    const baseUrl = "https://api.flickr.com/";
    axios({
      method: "GET",
      url: getImagesUrl,
      baseURL: baseUrl,
    })
      .then((res) => res.data)
      .then((res) => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({ images: [...this.state.images, ...res.photos.photo], });
        }
        console.log(res.photos);
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth,
    });
    window.addEventListener("resize", this.handleResize);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  handleResize = () => {
    // console.log("handleResize");
    this.setState({
      galleryWidth: this.getGalleryWidth(),
    });
  };

  setNext = () => {
    console.log('setNext')
    this.setState(
      (state) => {
        return { page: this.state.page + 1 };
      },
      () => this.getImages(this.props.tag)
    );
  };

  render() {
    return (
      <InfiniteScroll
        dataLength={this.state.images.length}
        // next={() => this.setState({page: page + 1})}
        next={() => this.setNext(this.props.tag)}
        hasMore={true}
        loader={<h4> Loading ... </h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="gallery-root">
          {this.state.images.map((dto) => {
            return (
              <Image
                key={"image-" + dto.id}
                dto={dto}
                galleryWidth={this.state.galleryWidth}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    );
  }
}

export default Gallery;
