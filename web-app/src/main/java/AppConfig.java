import org.jboss.resteasy.cdi.ResteasyCdiExtension;
import org.jboss.resteasy.plugins.server.servlet.HttpServlet30Dispatcher;
import security.CookieAuthenticationFilter;
import utils.ObjectMapperProvider;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * Запуск web-service
 */
@ApplicationScoped
@ApplicationPath("/")
public class AppConfig extends Application {

    @SuppressWarnings("unchecked")
    public Set<Class<?>> getClasses() {
        Set<Class<?>> singleton = new HashSet<>();
        singleton.add(CookieAuthenticationFilter.class);
        singleton.add(ObjectMapperProvider.class);
        singleton.addAll((Collection<? extends Class<?>>)(Object)extension.getResources());
        return singleton;
    }


    @ApplicationScoped
    @WebServlet(urlPatterns = {"/*"}, asyncSupported = true, initParams = {
            @WebInitParam(name = "javax.ws.rs.Application", value = "AppConfig")
    }, loadOnStartup = 1)
    public static class ResteasyServlet extends HttpServlet30Dispatcher {

        private static final long serialVersionUID = 1L;
    }


    /**
     * Отдача статики отдается контейнеру сервлетов.
     */
    @ApplicationScoped
    @WebServlet(urlPatterns = {
            "/assets/*",
            "/index.html"}, asyncSupported = true, loadOnStartup = 1)
    public static class StaticResourcesServlet extends HttpServlet {

        private static final long serialVersionUID = 1L;

        @Override
        public void service(ServletRequest request, ServletResponse response)
                throws ServletException, IOException {

            final RequestDispatcher rd = getServletContext().getNamedDispatcher("default");
            if(rd == null) {
                throw new IllegalStateException("You must register default servlet in servlet container");
            }

            rd.forward(request, response);
        }
    }

    @Inject
    private ResteasyCdiExtension extension;
}