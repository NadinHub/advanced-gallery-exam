import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import InfiniteScroll from "react-infinite-scroll-component";

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      count: 30,
      pageNumber: 1,
      galleryWidth: this.getGalleryWidth(),
      // height: window.innerHeight,
      // width: window.innerWidth,
    };
    // console.log(props);
  }

  getGalleryWidth() {
    // console.log(document.body.clientWidth);
    // console.log(window.innerWidth)
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    const { count, pageNumber } = this.state;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&&page=${pageNumber}&per_page=${count}&format=json&nojsoncallback=1`;
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
          this.setState((prevState) => {
            return { images: [...prevState.images, ...res.photos.photo] };
          });
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth,
    });
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener(
      "resize",
      this.setState({
        galleryWidth: document.body.clientWidth,
      })
    );
  }

  // componentWillReceiveProps(props) {
  // 	this.setState({ pageNumber: 1, images: [] }, () => {
  // 		this.getImages(props.tag);
  // 	})
  // }

  handleResize = () => {
    // console.log("handleResize");
    this.setState({
      galleryWidth: this.getGalleryWidth(),
    });
  };

  // setNext = () => {
  //   console.log("setNext");
  //   this.setState({ pageNumber: this.state.pageNumber + 1 });
  //   this.getImages(this.props.tag)
  // };
  fetchImages = () => {
    console.log("setNext");
    this.setState(
      (state) => {
        return { pageNumber: state.pageNumber + 1 };
      },
      () => this.getImages(this.props.tag)
    );
  };

  render() {
    //   console.log(this.state)
    return (
      <InfiniteScroll
        dataLength={this.state.images.length}
        next={() => {
          console.log("NEXT");
          this.fetchImages(this.props.tag);
        }}
        // next={()=> this.setNext}
        hasMore={true}
        loader={<h4> Loading ... </h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // className="gallery-root"
      >
        <div className="gallery-root">
          {this.state.images.map(
            (image, index) => (
              //  {
              //   // console.log(image);
              //   return
              <Image
                key={`image-${image.id}-title-${image.title} - ${index}`}
                image={image}
                galleryWidth={this.state.galleryWidth}
              />
            )
            // }
          )}
          {this.state.pageNumber}
        </div>
      </InfiniteScroll>
    );
  }
}

export default Gallery;
