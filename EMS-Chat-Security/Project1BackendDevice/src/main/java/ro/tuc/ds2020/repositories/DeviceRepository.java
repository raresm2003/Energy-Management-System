package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import ro.tuc.ds2020.entities.Device;

import java.util.List;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {

    @Override
    List<Device> findAll();

    List<Device> findByUserid(UUID userid);

    @Modifying
    @Transactional
    void deleteByUserid(UUID userId);
}