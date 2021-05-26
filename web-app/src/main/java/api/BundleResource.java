package api;


import com.google.common.collect.ImmutableMap;
import entity.ResourceMessage;
import org.apache.log4j.Logger;
import org.jboss.resteasy.annotations.cache.NoCache;
import serviсes.ResourceBundleService;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.HashMap;
import java.util.List;

@Path("api/v1")
public class BundleResource {

    @GET
    @Path("/get-static-resource/{lang}")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getResourceBundleService(@PathParam("lang") String lang) {

        final List<ResourceMessage> resourceBundle = resourceBundleService.getResourceBundle(lang);

        final HashMap<String,String> string = new HashMap<>();
        for (ResourceMessage resourceMessage : resourceBundle)
            string.put(resourceMessage.getMesKey(), resourceMessage.getMesValue());

        return ImmutableMap.of("strings", ImmutableMap.of(lang, string));
    }


    /**
     * Данные для сайта (часто меняющаяся информация).
     * @param securityContext Информация о залогиненом пользователе, если есть.
     * @return JSON с данными для сайта.
     */
    @GET
    @Path("dynamic-data")
    @Produces(MediaType.APPLICATION_JSON)
    @NoCache
    public Object getDynamicData(@Context SecurityContext securityContext) {

        return ImmutableMap.of(
                "principal", securityContext.getUserPrincipal() != null ? securityContext.getUserPrincipal() : "");
    }

    @Inject
    private ResourceBundleService resourceBundleService;

}
