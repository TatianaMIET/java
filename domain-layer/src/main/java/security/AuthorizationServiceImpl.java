
package security;

import java.io.IOException;
import java.security.Principal;
import java.util.Date;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.commons.lang3.StringUtils;
import serviсes.SecurityService;


/**
 * Сервис авторизации для web-приложения.
 */

@ApplicationScoped
public class AuthorizationServiceImpl {

	public static final String ENCRYPT_NAME = "EncryptProvider";

	public String setupSecurityContext(ContainerRequestContext request, String salt, String data, Date ticketDate) {

		final TicketModel ticket;
		try {
			ticket = mapper.readValue(data, TicketModel.class);

			request.setSecurityContext(new SecurityContextImpl(
					request.getSecurityContext(),
					securityService.authorize(ticket)));

			return ticket.getName();
		} catch (JsonParseException | JsonMappingException e) {
			e.printStackTrace();
			return StringUtils.EMPTY;
		} catch (IOException e) {
			throw new WebApplicationException(e, Status.UNAUTHORIZED);
		}
	}


	private static class SecurityContextImpl implements SecurityContext {

		public SecurityContextImpl(SecurityContext prev, AppPrincipal principal) {
			this.prev = prev;
			this.principal = principal;
		}

		@Override
		public Principal getUserPrincipal() {
			return principal;
		}

		@Override
		public boolean isUserInRole(String role) {
			return true;
		}

		@Override
		public boolean isSecure() {
			return false;
		}

		@Override
		public String getAuthenticationScheme() {
			return FORM_AUTH;
		}

		private final SecurityContext prev;
		private final AppPrincipal principal;
	}

	@Inject
	private SecurityService securityService;

	@Inject
	private ObjectMapper mapper;

}


