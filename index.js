
(() => {
  const React = require("react");
  const {render} = require("react-dom");
  const {Button, Col, Row, Container} = require("reactstrap");

  const {T, now} = require("timeline-monoid");
  const marked = require("marked");

  const fs = require("fs");
  const util = require("util");

  const remote = require("electron").remote;
  const Dialog = remote.dialog;

  const mermaid = require("mermaid");

  mermaid.initialize({
    startOnLoad: true
  });
  //=============================================

  const TimelineEl = (timelineEl) => {
    class TimelineComponent extends React.Component {
      constructor() {
        super();
        this.state = {
          el: timelineEl[now]
        };
        const dummyTL = timelineEl
          .wrap((val) => {
            this.setState({
              el: val
            });
          });
      }
      componentWillUnmount() {
        //timelineEl.done = 1;
      }
      render() {
        return (<span>{this.state.el}</span>);
      }
    }
    return (<TimelineComponent/>);
  };
  //=============================================

  const fileTL = T();

  const contentLoadTL = T(timeline => {
    fileTL.wrap((fileName) => {
      fs.readFile(fileName, "utf8", (err, data) => {
        timeline[now] = data;
      });
    });
  }).wrap((data) => (markdownTL[now] = data));


  const autoSave = T(
    (timeline) => {
      const f = () => timeline[now] = true;
      setInterval(f, 5000);
    }
  ).wrap(
    () => (!!fileTL[now])
      ? (() => {
        const f = a => a; //do nothing
        fs.writeFile(fileTL[now], markdownTL[now], f);
        return true;
      })()
      : true
  );

  const Main = () => {
    const style0 = {
      "position": "fixed",
      "width": "100%",
      "height": "100%",
      "margin": "0px",
      "padding": "0px",
      "backgroundColor": "#000000",
      "color": "white"
    };
    const styleFile = {
      "position": "fixed",
      "padding": "3px",
      "color": "white",
      "fontSize": "22px"
    };

    return (<div style={style0}>
      <Container fluid={true}>
        <Row >
      <Col sm="2" >
        <Button onClick={() => {
        Dialog.showOpenDialog(null, {
          properties: ["openFile"],
          title: "File(Single Select)",
          defaultPath: ".",
          filters: [
            {
              name: "MarkDown",
              extensions: ["md"]
            }
          ]
        }, ([fileName]) => {
          const dummy = !!(fileName)
            ? (() => fileTL[now] = fileName)()
            : false;
        });

      }} >File</Button>

      </Col>
      <Col sm="10" >
        <div style = {styleFile}>
        {TimelineEl(fileTL)}
      </div>
      </Col>
      </Row>
      </Container>

      {Panes(style0)}
     </div>);
  };

  const Panes = (style0) => {
    const style1 = {
      "width": "100%",
      "height": "95%",
      "margin": "0px",
      "padding": "0px",
      "backgroundColor": "#000000"
    };
    return (
      //================
      <Container fluid={true} style={style0}>
        <Row style={style0}>
    <Col sm="6" >
      <div style={style1}>
        {Editor()}
      </div>
    </Col>
    <Col sm="6" >
     <div style={style1}>
        {Viewer()}
     </div>
    </Col>
  </Row>
</Container>
      //==================
      );
  };

  const markdownTL = T();

  const renderer = new marked.Renderer();
  renderer.code = (code, language) => {
    return (code.match(/^sequenceDiagram/)
    || code.match(/^graph/))
      ? "<div class='mermaid'>" + code + "</div>"
      : "<pre><code>" + code + "</code></pre>";
  };

  marked.setOptions({
    renderer: renderer,
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });

  const htmlTL = markdownTL
    .sync((text) => marked(text))
    .sync((html) => <div
      dangerouslySetInnerHTML={{
        __html: html
      }}/>);

  const Editor = () => TimelineEl(
    contentLoadTL
      .sync(content => {
        const contentHTML = content.replace(/\n/g, "<BR>");
        const onInput = (e) => {
          markdownTL[now] = e.target.innerText;
        };
        const onScroll = (e) => {
          //alert(e);
        };
        const style = {
          "width": "100%",
          "height": "100%",
          "padding": "15px",
          "overflow": "auto",
        };
        return (<div
          contentEditable
          style={style}
          className={"editor"}
          onInput={onInput}
          onScroll={onScroll}
          dangerouslySetInnerHTML={{
            __html: contentHTML
          }}
          />);
      })
  );


  const Viewer = () => TimelineEl(
    htmlTL
      .sync(innerHTML => {
        const onScroll = (e) => {
          //alert(e);
        };
        const style = {
          "width": "100%",
          "height": "100%",
          "padding": "15px",
          "overflow": "auto"
        };
        return <div
          style={style}
          className={"viewer"}
          onScroll={onScroll}
          >{innerHTML}</div>;
      })
  );
  //----------

  //======================================================
  render(Main(), document.getElementById("container"));

})();
