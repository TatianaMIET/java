package collections;

import org.dozer.Mapper;

import java.util.ArrayList;
import java.util.List;

public final class DozerUtilities {

    public static <T, V> List<T> map(Mapper mapper, List<V> source, Class<T> destinationClass){

        if (source == null){
            return new ArrayList<>();
        }

        final List<T> result = new ArrayList<>(source.size());
        for (V item : source){
            result.add(mapper.map(item, destinationClass));
        }
        return result;

    }

}
