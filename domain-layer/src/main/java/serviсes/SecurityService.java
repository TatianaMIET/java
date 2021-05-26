package serviсes;

import javax.enterprise.context.Dependent;

import security.AppPrincipal;
import security.TicketModel;

/**
 * Сервис авторизации и аутентификации.
 */
@Dependent
public class SecurityService {


	public AppPrincipal authorize(TicketModel ticket)
	{
		return new AppPrincipal(
				ticket.getUserId(),
				ticket.getName(),
				ticket.getSurname(),
				ticket.getBirthDay(),
				ticket.getEmail(),
				ticket.getPhoneNumber()
		);
	}
}