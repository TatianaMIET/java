package security;

import javax.enterprise.context.Dependent;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Default;
import javax.enterprise.inject.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.Provider;
import java.security.Principal;

@Provider
@Dependent
public class AppPrincipalProducer {


    @Produces
    @RequestScoped
    public AppPrincipal get() {
        final Principal principal = securityContext.getUserPrincipal();
        if(principal instanceof AppPrincipal) {
            return (AppPrincipal)principal;
        }
        return null;
    }

    @Context
    private SecurityContext securityContext;
}
