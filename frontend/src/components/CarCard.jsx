import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Text,
  Theme,
} from "@chakra-ui/react";
import { Avatar } from "./ui/avatar.jsx";
import EditCar from "./EditCar.jsx";
import {useColorModeValue} from "./ui/color-mode.jsx";
import {jwtDecode} from "jwt-decode";
import {BASE_URL} from "./CarsGrid.jsx";
import {toaster} from "./ui/toaster.jsx";


const CarCard = ({ car, setCars }) => {
  const token = localStorage.getItem("token");
  let currentUserId;
  try {
    if (token) {
      const decodedToken = jwtDecode(token);
      currentUserId = decodedToken.sub.id;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
  const isOwner = car.owner.id === currentUserId;


  const handleDeleteCar = async () => {
      const token = localStorage.getItem("token");
      try{
          const res = await fetch(BASE_URL+"/api/cars/" + car.id,{
              method: "DELETE",
              headers:{
                Authorization: `Bearer ${token}`,
              }
          })
          const data = await res.json();

          if(!res.ok){
              throw new Error(data.error)
          }
          setCars((prevCars) => prevCars.filter((c) => c.id !== car.id))
          toaster.success({
              title:"Sukcess🎉",
              description:"Twój samochód został pomyślnie usunięty.",
              duration:4000,
          })

      } catch (error) {
          toaster.error({
              title:"An error occured.",
              description:error.message,
              duration: 4000,
          })
      }
  }

  return (
      <Card.Root shadow="2px -2px var(--shadow-color)" shadowColor="teal" bg={useColorModeValue("teal.500", "gray.950")}>
        <Image
          src={car.imgUrl}
          alt={car.description}
          borderRadius={5}
          aspectRatio={16 /10}
        />
        <Card.Header>
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Heading>{car.model}</Heading>
            <Flex flexDirection="column" alignItems="flex-end">
              <Avatar name={car.owner.username} src={car.owner.imgUrl} />
              <Text textStyle={"xs"}>{"@" + (car.owner.username)}</Text>
            </Flex>
          </Flex>
        </Card.Header>
        <Card.Body minH={"100px"}>
          <Text>{car.description}</Text>
        </Card.Body>
        <Card.Footer gap="2">
          <Button variant="solid">Book now</Button>
          {isOwner && (
           <>
            <EditCar car={car} setCars={setCars}/>
            <Button variant="outline" colorScheme="red" onClick={handleDeleteCar}>
              Delete
            </Button>
           </>
          )}
        </Card.Footer>
      </Card.Root>
  );
};

export default CarCard;
