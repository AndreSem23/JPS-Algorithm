import { Col, Row } from 'react-bootstrap';
import Grid from './Grid/Grid';

function App() {
  return (
    <div className='m-2'>
      
      <Row className='mb-2 justify-content-center'>
        <Col xs='auto'>
          <Grid rows={20} cols={20}/>
        </Col>
      </Row>
        
    </div>
  );
}

export default App;
