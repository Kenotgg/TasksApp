import {Card, CardFooter, CardHeader, Divider, CardBody, Text} from '@chakra-ui/react';
export default function Task({title, description, createdAt}){
    return (
            <Card>
                <CardHeader fontWeight={'bold'} size="md">{title + ':'}</CardHeader>
                <Divider borderColor={"gray"}/>
                <CardBody>
                    <Text>{description + '.'}</Text>
                </CardBody>
                {/* <CardFooter>{createdAt}</CardFooter> */}
            </Card>
    )
};