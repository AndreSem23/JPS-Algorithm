import { Col, Form, Row } from 'react-bootstrap';
import Grid from './Grid/Grid';

function App() {

  return (
    <div className='m-2'>      
      <Row className='mb-2 justify-content-around'>
        <Col md='2'>
          <Form.Label>Size</Form.Label>
          <Form.Range min={20} max={50} onChange={e => console.log(e.target.value)}/>
        </Col>
        <Col xs='auto'>
          <Grid rows={20} cols={20}/>
        </Col>
      </Row>
        
    </div>
  );
}

export default App;
