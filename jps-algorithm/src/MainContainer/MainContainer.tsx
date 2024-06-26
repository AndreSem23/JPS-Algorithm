import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import Grid from "../Grid/Grid"

const MainContainer = () => {
    const [size, setSize] = useState<number>(20)
    const [sliderValue, setSliderValue] = useState<number>(20)

    return (
        <>
            <Row className='m-2 justify-content-between' >
                <Col md='3'>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Size</Form.Label>
                            <Form.Range min={20} max={50} value={sliderValue} onChange={e => setSliderValue(Number(e.target.value))} readOnly/>
                        </Col>
                        <Col md='3' className='align-self-center'>
                            <Form.Control type='numeric' value={sliderValue}/>
                        </Col>
                    </Row>  
                    <Row className="m-2 justify-content-between" >
                        <Col xs='auto'>
                            <Button onClick={() => setSize(sliderValue)}>Create</Button>
                        </Col>
                    </Row>              
                </Col>
                <Col md='9'>
                    <Grid size={size}/>
                </Col>
            </Row>
        </>
    )
}

export default MainContainer
