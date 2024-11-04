import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UserInfo } from "./info";
import { UserInfoProps } from "@/types/types";
import { UserAccessPage } from "./access";

export function UserDetails() {
  //hooks initialization
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activePage = searchParams.get("page") || 'information';
  const user = location.state as UserInfoProps;

  //functions 
  const onActivePageChange = (page: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('page', page);
    navigate(`/utilisateurs/${id}?${newSearchParams.toString()}`, { state: user });
  }



  //Nested component
  const Render = () => {
    console.log(activePage);
    console.log(user);
    switch (activePage) {
      case 'information':
        return <UserInfo />
      case 'accès':
        return <UserAccessPage />
      default:
        return <UserInfo />
    }

  }

  return (
    <div>
      <ButtonGroup>
        <Button
          className={`font-normal text-sm text-center px-5 ${activePage === 'information' ? 'border-b-2 border-b-primary' : ''}`}

          color="primary"
          size="md"
          variant={'light'}
          radius="none"
          startContent={
            <FontAwesomeIcon className="" icon={faUser} />
          }
          onPress={() => onActivePageChange('information')}
        >
          Information
        </Button>
        <Button
          className={`font-normal text-sm text-center px-5 ${activePage === 'accès' ? 'border-b-2 border-b-primary' : ''}`}

          color="primary"
          size="md"
          variant={'light'}
          radius="none"
          startContent={
            <FontAwesomeIcon className="" icon={faKey} />

          }
          onPress={() => onActivePageChange('accès')}
        >
          Accès
        </Button>

      </ButtonGroup>
      <Render />
    </div>
  );
}